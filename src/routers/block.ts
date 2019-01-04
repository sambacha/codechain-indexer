import { H256 } from "codechain-primitives/lib";
import { Router } from "express";
import { IndexerContext } from "../context";
import * as Exception from "../exception";
import * as BlockModel from "../models/logic/block";

/**
 * @swagger
 * tags:
 *   name: Block
 *   description: Block management
 * definitions:
 *   Block:
 *     type: object
 *     required:
 *       - content
 *     properties:
 *       _id:
 *         type: string
 *         description: ObjectID
 *       content:
 *         type: string
 *         description: block example
 */
export function handle(_C: IndexerContext, router: Router) {
    /**
     * @swagger
     * /block/latest:
     *   get:
     *     summary: Returns latest block
     *     tags: [Block]
     *     responses:
     *       200:
     *         description: latest block
     *         schema:
     *           $ref: '#/definitions/Block'
     */
    router.get("/block/latest", async (_A, req, next) => {
        try {
            const latestBlockInst = await BlockModel.getLatestBlock();
            req.json(
                latestBlockInst ? latestBlockInst.get({ plain: true }) : null
            );
        } catch (e) {
            next(e);
        }
    });

    /**
     * @swagger
     * /block/:hashOrNumber:
     *   get:
     *     summary: Returns specific block (Not implemented)
     *     tags: [Block]
     *     responses:
     *       200:
     *         description: specific block
     *         schema:
     *           $ref: '#/definitions/Block'
     */
    router.get("/block/:hashOrNumber", async (req, res, next) => {
        const hashOrNumber = req.params.hashOrNumber;
        let hashValue;
        let numberValue;
        try {
            hashValue = new H256(hashOrNumber);
        } catch (e) {
            if (!isNaN(hashOrNumber)) {
                numberValue = parseInt(hashOrNumber, 10);
            }
        }
        try {
            let latestBlockInst;
            if (hashValue) {
                latestBlockInst = await BlockModel.getByHash(hashValue);
            } else if (numberValue != undefined) {
                latestBlockInst = await BlockModel.getByNumber(numberValue);
            }
            res.json(
                latestBlockInst ? latestBlockInst.get({ plain: true }) : null
            );
        } catch (e) {
            next(e);
        }
    });

    /**
     * @swagger
     * /block:
     *   get:
     *     summary: Returns blocks (Not implemented)
     *     tags: [Block]
     *     parameters:
     *       - name: address
     *         description: Author filter by address
     *         in: formData
     *         required: false
     *         type: string
     *       - name: page
     *         description: page for the pagination (default 1)
     *         in: formData
     *         required: false
     *         type: number
     *       - name: itemsPerPage
     *         description: items per page for the pagination (default 15)
     *         in: formData
     *         required: false
     *         type: number
     *     responses:
     *       200:
     *         description: blocks
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Block'
     */
    router.get("/block", async (req, res, next) => {
        const address = req.query.address;
        const page = req.query.page && parseInt(req.query.page, 10);
        const itemsPerPage =
            req.query.itemsPerPage && parseInt(req.query.itemsPerPage, 10);

        try {
            const blockInsts = await BlockModel.getBlocks({
                address,
                page,
                itemsPerPage
            });
            const blocks = blockInsts.map(blockInst =>
                blockInst.get({ plain: true })
            );
            res.json(blocks);
        } catch (e) {
            next(e);
        }
    });

    /**
     * @swagger
     * /block/count:
     *   get:
     *     summary: Returns total count of the blocks (Not implemented)
     *     tags: [Block]
     *     parameters:
     *       - name: address
     *         description: Author filter by address
     *         in: formData
     *         required: false
     *         type: string
     *     responses:
     *       200:
     *         description: total count of the blocks
     *         schema:
     *           type: number
     *           example: 12
     */
    router.get("/block/count", async (_A, _B, next) => {
        try {
            throw Exception.NotImplmeneted;
        } catch (e) {
            next(e);
        }
    });
}
