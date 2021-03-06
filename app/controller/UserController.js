const models = require("../model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcryptjs");
const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sharp = require("sharp"),
  fs = require("fs"),
  request = require("request");
const { promisify } = require("util");
const path = require("path");
const helperUser = require("../helper/user");

/******************* provider image  ********************/
const dirName = path.dirname(require.main.filename);
const pathName = `${dirName}/public/images/users/`;
let avatarName = null;

const readdir = promisify(fs.exists);
const unlinkdir = promisify(fs.unlink);
const writefiledir = promisify(fs.writeFile);

sharp.cache(false);

const writeImage = path => {
  return new Promise((resolve, reject) => {
    sharp(path)
      .resize(150, 150)
      .toBuffer(async (err, buffer) => {
        if (err) return reject(err);
        await writefiledir(path, buffer);
        resolve();
      });
  });
};

const settingImage = async (logo, file) => {
  if (logo !== null) {
    try {
      const checkFile = await readdir(pathName + logo);
      if (checkFile) {
        if (file) {
          await unlinkdir(pathName + logo);
          await writeImage(file.path);
          avatarName = file.filename;
        } else {
          await unlinkdir(pathName + logo);
        }
      }
    } catch (err) {
      res.json({
        message: err
      });
    }
  } else {
    if (file) {
      await writeImage(file.path);
      avatarName = file.filename;
    }
  }
};
/************************* **************************/

const saveUser = async (req, res) => {
  await bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {
      const user = {
        username: req.body.username,
        password: hash,
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address
      };
      await User.create(user)
        .then(result => {
          const response = helperUser.loginJWT(result);
          res.status(200).json(response);
        })
        .catch(err => {
          res.status(500).json({
            message: "Something has wrong",
            error: err
          });
        });
    }
  });
};

const spreadNameFromFacebook = name => {
  return name.split(" ");
};

const downloadImageFromUrl = async (url, provider_id) => {
  let options = {
    url: url,
    method: "get",
    encoding: null
  };

  const imageName = provider_id;

  await request(options, (err, res, body) => {
    if (err) {
      imageName = "noimg";
    } else {
      fs.writeFileSync(pathName + provider_id + ".jpg", body);
    }
  });
  return imageName + ".jpg";
};

const User = models.User;

const users = {
  userAllData: async (req, res) => {
    await User.findAll()
      .then(user => {
        res.status(200).json({
          message: "Success",
          data: user
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  userDataById: async (req, res) => {
    await User.findOne({
      where: {
        user_id: req.decoded.user_id
      }
    })
      .then(user => {
        res.status(200).json({
          user: user
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  signUpUsers: async (req, res) => {
    await saveUser(req, res);
  },
  checkUsername: async (req, res) => {
    await User.findOne({
      attributes: ["username"],
      where: {
        username: req.body.username
      }
    })
      .then(result => result !== null)
      .then(isUnique => {
        res.status(200).json({
          username: isUnique
        });
      });
  },
  checkEmail: async (req, res) => {
    await User.findOne({
      attributes: ["email"],
      where: {
        email: req.body.email
      }
    })
      .then(result => result !== null)
      .then(isUnique => {
        res.status(200).json({
          email: isUnique
        });
      });
  },
  loginUsers: async (req, res) => {
    const user = await User.findOne({
      attributes: ["user_id", "password", "email"],
      where: { username: req.body.username }
    });
    if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(401).json({
          status: false,
          data: null,
          message: "Please check username or password."
        });
      }
      const response = helperUser.loginJWT(user);
      return res.status(200).json({
        status: true,
        message: "Login successful.",
        data: response
      });
    } else {
      res.status(200).json({
        message: "Please check username or password.",
        status: false,
        data: null
      });
    }
  },
  refreshToken: async (req, res) => {
    await User.findOne({
      attributes: ["user_id"],
      where: {
        user_id: req.session.userId
      }
    })
      .then(user => {
        if (!user) {
          res.status(401).json({
            message: "cannot refresh token"
          });
          return;
        }
        const response = helperUser.loginJWT(user);
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  },
  changePassword: (req, res) => {
    if (req.body.password == req.body.confirm_password) {
      User.findOne({
        attributes: ["user_id"],
        where: {
          user_id: req.decoded.user_id
        }
      }).then(user => {
        if (!user)
          return res.status(500).json({
            message: "user not found"
          });
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err)
            return res.json({
              message: err
            });
          User.update(
            {
              password: hash
            },
            {
              where: {
                user_id: user.user_id
              }
            }
          ).then(result => {
            res.status(200).json({
              message: "reset password complete"
            });
          });
        });
      });
    } else {
      res.json({
        message: "Passwords not do match."
      });
    }
  },
  updatebyId: async (req, res) => {
    User.findByPk(req.decoded.user_id, {
      attributes: ["avatar"]
    })
      .then(async user => {
        avatarName = user.avatar;
        if (req.file) {
          await settingImage(avatarName, req.file);
        }

        const userdata = {
          name: req.body.name,
          lastname: req.body.lastname,
          email: req.body.email,
          telephone: req.body.telephone,
          address: req.body.address,
          avatar: avatarName != null ? avatarName : null
        };

        await User.update(userdata, {
          where: {
            user_id: req.decoded.user_id
          }
        })
          .then(result => {
            res.status(200).json({
              message: "update success",
              status: true
            });
          })
          .catch(err => {
            res.status(401).json({
              message: err
            });
          });
      })
      .catch(err => {
        res.status(401).json({
          message: err
        });
      });
  },
  updateUser: (req, res) => {
    User.findByPk(req.body.user_id, {
      attributes: ["avatar", "password"]
    })
      .then(async emp => {
        let password = emp.password;
        avatarName = emp.avatar;

        if (req.body.password) {
          password = bcrypt.hashSync(req.body.password, 10);
        }

        if (req.file) {
          await settingImage(avatarName, req.file);
        }

        const user = {
          username: req.body.username,
          password: password,
          name: req.body.name,
          lastname: req.body.lastname,
          email: req.body.email,
          telephone: req.body.telephone,
          address: req.body.address,
          avatar: avatarName !== null ? avatarName : null
        };

        await User.update(user, {
          where: {
            user_id: req.body.user_id
          }
        })
          .then(result => {
            avatarName = null;
            res.status(200).json({
              message: "update success",
              status: true
            });
          })
          .catch(err => {
            res.status(401).json({
              message: err
            });
          });
      })
      .catch(err => {
        res.status(401).json({
          message: err
        });
      });
  },
  deleteData: async (req, res) => {
    await User.destroy({
      where: {
        user_id: req.body.user_id
      }
    })
      .then(async result => {
        const image = req.body.avatar;
        for (let img of image) {
          await settingImage(img, false);
        }

        res.status(200).json({
          message: "Delete complete."
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  forgotPassword: (req, res) => {
    async.waterfall(
      [
        done => {
          crypto.randomBytes(15, (err, buf) => {
            let token = buf.toString("hex");
            done(err, token);
          });
        },
        (token, done) => {
          User.findOne({
            where: {
              email: req.body.email
            }
          })
            .then(user => {
              if (!user) {
                return res.status(200).json({
                  message: "email not found.",
                  status: false
                });
              }
              User.update(
                {
                  resetPasswordToken: token,
                  resetPasswordExpired: Date.now() + 3600000
                },
                {
                  where: {
                    email: req.body.email
                  }
                }
              ).then(() => {
                done(null, token, user);
              });
            })
            .catch(err => {
              res.status(500).json({
                message: err
              });
            });
        },
        (token, user, done) => {
          let smtpTransport = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            secureConnection: false,
            port: 587,
            tls: {
              ciphers: "SSLv3"
            },
            auth: {
              user: "best_dota@hotmail.com",
              pass: "jykusijhkiwqbabh"
            }
          });
          let mailOptions = {
            to: "best_dota@hotmail.com",
            from: "Kai Delivery",
            subject: "Kai Delivery Password Reset",
            text:
              "Please click on the following link, or paste into you browser to complete\n" +
              "http://localhost:3001/reset/" +
              token
          };
          smtpTransport.sendMail(mailOptions, err => {
            if (err) {
              return res.status(401).json({
                message: err
              });
            }
            res.status(200).json({
              message: "sended email.",
              status: true
            });
            done(err, "done");
          });
        }
      ],
      err => {
        if (err)
          return res.status(422).json({
            message: err
          });
      }
    );
  },
  resetPassword: async (req, res) => {
    await User.findOne({
      attributes: ["user_id"],
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpired: {
          [Op.gt]: Date.now()
        }
      }
    })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: "Password reset token is invalid or has expired."
          });
        }
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        if (!password === confirm_password) {
          return res.json({
            message: "Passwords do not match."
          });
        }
        bcrypt.hash(password, 10, (err, hash) => {
          if (err)
            return res.json({
              message: "error"
            });
          User.update(
            {
              password: hash,
              resetPasswordToken: null,
              resetPasswordExpired: null
            },
            {
              where: {
                user_id: user.user_id
              }
            }
          ).then(() => {
            res.status(200).json({
              message: "updated new password."
            });
          });
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  checkResetPasswordToken: async (req, res) => {
    await User.findOne({
      attributes: ["resetPasswordToken"],
      where: {
        resetPasswordToken: req.params.token
      }
    }).then(user => {
      if (!user) {
        return res.json({
          status: false
        });
      }
      res.json({
        status: true
      });
    });
  },
  loginFacebook: async (req, res) => {
    await User.findOne({
      attributes: ["user_id", "email", "provider_id"],
      where: {
        provider_id: req.body.provider_id
      }
    })
      .then(async user => {
        if (user) {
          const response = helperUser.loginJWT(user);
          return res.status(200).json(response);
        }
        await User.findOne({
          attributes: ["user_id", "email", "avatar"],
          where: {
            email: req.body.email
          }
        }).then(async user => {
          const avatarName = await downloadImageFromUrl(
            req.body.image,
            req.body.provider_id
          );
          if (!user) {
            await User.create({
              name: spreadNameFromFacebook(req.body.name)[0],
              lastname: spreadNameFromFacebook(req.body.name)[1],
              email: req.body.email,
              provider: "2",
              provider_id: req.body.provider_id,
              avatar: avatarName
            }).then(user => {
              const response = helperUser.loginJWT(user);
              res.status(200).json(response);
            });
          }

          if (user.avatar) {
            await unlinkdir(pathName + user.avatar);
          }

          await User.update(
            {
              username: null,
              password: null,
              name: spreadNameFromFacebook(req.body.name)[0],
              lastname: spreadNameFromFacebook(req.body.name)[1],
              provider: "2",
              provider_id: req.body.provider_id,
              avatar: avatarName
            },
            {
              where: {
                email: req.body.email
              }
            }
          ).then(() => {
            const response = helperUser.loginJWT(user);
            res.status(200).json(response);
          });
        });
      })
      .catch(error => {
        res.status(401).json({
          err: "error"
        });
      });
  },
  addUser: (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      } else {
        if (req.file) {
          await settingImage(null, req.file);
        }

        const user = {
          username: req.body.username,
          password: hash,
          name: req.body.name,
          lastname: req.body.lastname,
          email: req.body.email,
          telephone: req.body.telephone,
          address: req.body.address,
          avatar: avatarName !== null ? avatarName : null
        };

        console.log(user);

        await User.create(user)
          .then(result => {
            avatarName = null;
            res.status(200).json({
              message: "success"
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
    });
  }
};

module.exports = users;
