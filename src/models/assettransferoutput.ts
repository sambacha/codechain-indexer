import * as Sequelize from "sequelize";

import { AssetSchemeAttribute } from "./assetscheme";

export interface AssetTransferOutputAttribute {
    id?: string;
    actionId: number;
    lockScriptHash: string;
    parameters: Buffer[];
    assetType: string;
    amount: string;
    owner?: string | null;
    assetScheme: AssetSchemeAttribute;
}

export interface AssetTransferOutputInstance
    extends Sequelize.Instance<AssetTransferOutputAttribute> {}

export default (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes
) => {
    const AssetTransferOutput = sequelize.define(
        "AssetTransferOutput",
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT
            },
            actionId: {
                allowNull: false,
                type: DataTypes.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "Actions",
                    key: "id"
                }
            },
            lockScriptHash: {
                allowNull: false,
                type: DataTypes.STRING
            },
            parameters: {
                allowNull: false,
                type: DataTypes.JSONB
            },
            assetType: {
                allowNull: false,
                type: DataTypes.STRING
            },
            amount: {
                allowNull: false,
                type: DataTypes.NUMERIC({ precision: 20, scale: 0 })
            },
            owner: {
                type: DataTypes.STRING
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        },
        {}
    );
    AssetTransferOutput.associate = () => {
        // associations can be defined here
    };
    return AssetTransferOutput;
};
