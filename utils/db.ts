import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.db'
})

class Icon extends Model<InferAttributes<Icon>, InferCreationAttributes<Icon>> {
  declare id: CreationOptional<number>

  declare origin: string
  declare dataURI: string

  declare createdAt: CreationOptional<Date>
}

Icon.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    origin: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dataURI: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: DataTypes.DATE
  },
  { sequelize, timestamps: true, createdAt: true, updatedAt: false }
)

await sequelize.sync({ alter: true })

export { Icon }
