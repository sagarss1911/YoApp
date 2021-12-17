/**
 * @swagger
 * resourcePath: /Friends
 * description: All Friend Request Related API
 */
 'use strict';

 let friendsManager = require('../manager/Friends');

 /**
  * @swagger
  * /api/v1/friends/add_friend:
  *   post:
  *     summary: friends.
  *     tags:
  *      - Friends
  *     parameters :
  *     - name: x-auth-api-key
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string
  *     - name: x-auth-token
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string 
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               toId:
  *                 type: integer
  *                 example: 1
  *                 paramType: body  
  *     responses:
  *       200:
  *         description: user object
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   type: object
  *       400:
  *         description: error in request processing
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   example: 400
 */
 let addFriend = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    let userName = req.user ? req.user.userName : null;
     return friendsManager
         .addFriend(userid,userName,req.body)
         .then(data => {
             let result = {
                 status: 200,
                 data: data
             }
             return res.json(result);
         })
         .catch(next);
 }
 
 /**
  * @swagger
  * /api/v1/friends/change_friend_request_status:
  *   post:
  *     summary: friends.
  *     tags:
  *      - Friends
  *     parameters :
  *     - name: x-auth-api-key
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string
  *     - name: x-auth-token
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string 
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               friends_id:
  *                 type: integer
  *                 example: 1
  *                 paramType: body
  *               status:
  *                 type: integer
  *                 example: 1
  *                 paramType: body  
  *     responses:
  *       200:
  *         description: user object
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   type: object
  *       400:
  *         description: error in request processing
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   example: 400
 */
  let ChangeFriendRequestStatus = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
     return friendsManager
         .ChangeFriendRequestStatus(userid,req.body)
         .then(data => {
             let result = {
                 status: 200,
                 data: data
             }
             return res.json(result);
         })
         .catch(next);
 }
 
 /**
  * @swagger
  * /api/v1/friends/my_friend_list_with_mutual_count:
  *   post:
  *     summary: friends.
  *     tags:
  *      - Friends
  *     parameters :
  *     - name: x-auth-api-key
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string
  *     - name: x-auth-token
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string   
  *     responses:
  *       200:
  *         description: user object
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   type: object
  *       400:
  *         description: error in request processing
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   example: 400
 */
  let myFriendListWithMutualCount = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
     return friendsManager
         .myFriendListWithMutualCount(userid)
         .then(data => {
             let result = {
                 status: 200,
                 data: data
             }
             return res.json(result);
         })
         .catch(next);
 }
 /**
  * @swagger
  * /api/v1/friends/my_blocked_friend_list_with_mutual_count:
  *   post:
  *     summary: friends.
  *     tags:
  *      - Friends
  *     parameters :
  *     - name: x-auth-api-key
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string
  *     - name: x-auth-token
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string 
  *     responses:
  *       200:
  *         description: user object
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   type: object
  *       400:
  *         description: error in request processing
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   example: 400
 */
  let myBlockedFriendListWithMutualCount = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;    
     return friendsManager
         .myBlockedFriendListWithMutualCount(userid)
         .then(data => {
             let result = {
                 status: 200,
                 data: data
             }
             return res.json(result);
         })
         .catch(next);
 }
 /**
  * @swagger
  * /api/v1/friends/unblock_friend:
  *   post:
  *     summary: friends.
  *     tags:
  *      - Friends
  *     parameters :
  *     - name: x-auth-api-key
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string
  *     - name: x-auth-token
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string 
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               user_id:
  *                 type: integer
  *                 example: 1
  *                 paramType: body  
  *     responses:
  *       200:
  *         description: user object
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 data:
  *                   type: object
  *       400:
  *         description: error in request processing
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 message:
  *                   type: string
  *                 status:
  *                   type: integer
  *                   example: 400
 */
  let unBlockFriend = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
     return friendsManager
         .unBlockFriend(userid,req.body.user_id)
         .then(data => {
             let result = {
                 status: 200,
                 data: data
             }
             return res.json(result);
         })
         .catch(next);
 }
 
 module.exports = {    
    addFriend: addFriend,
    ChangeFriendRequestStatus:ChangeFriendRequestStatus,
    myFriendListWithMutualCount:myFriendListWithMutualCount,
    myBlockedFriendListWithMutualCount:myBlockedFriendListWithMutualCount,
    unBlockFriend:unBlockFriend    
 };