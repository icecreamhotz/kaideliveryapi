module.exports = (sequelize, DataTypes) => {
  const ChangeLog = sequelize.define(
    "changelogs",
    {
      changelog_id: {
        type: DataTypes.INTEGER(6),
        primaryKey: true,
        autoIncrement: true
      },
      change_id: {
        type: DataTypes.INTEGER(6)
      },
      old_foodname: {
        type: DataTypes.STRING(30)
      },
      old_foodprice: {
        type: DataTypes.DECIMAL(7, 2)
      },
      new_foodname: {
        type: DataTypes.STRING(30)
      },
      new_foodprice: {
        type: DataTypes.DECIMAL(7, 2)
      },
      changelog_status: {
        type: DataTypes.STRING(1)
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return ChangeLog;
};
