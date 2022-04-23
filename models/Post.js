const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {}

// create fields/columns for Post model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        //metadata, including the naming conversion
        sequelize,
        freezeTableName: true,
        //in sequelize, columns are camelcase by default. This allows the columns names to have an underscore naming convention
        underscored: true,
        modelName: 'post'
    }
);

//makes the Post model accessible to other parts of the application.
module.exports = Post;