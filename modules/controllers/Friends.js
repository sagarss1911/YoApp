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
  *     summary: Add Friends.
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
  *     - name: Accept-Language
  *       in: header   
  *       description: Language
  *       required: false
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
  *                 example: 1640110920033
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
         .addFriend(userid,userName,req)
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
  *     - name: Accept-Language
  *       in: header   
  *       description: Language
  *       required: false
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
  *                 description: (0- request sent, 1 =accepted, 2=declined, 3=blocked, 4= deleted)
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
         .ChangeFriendRequestStatus(userid,req)
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
  *     - name: Accept-Language
  *       in: header   
  *       description: Language
  *       required: false
  *       type: string
  *     - name: page
  *       in: query   
  *       description: page
  *       required: false
  *       type: number
  *     - name: limit
  *       in: query   
  *       description: page
  *       required: false
  *       type: number
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               keyword:
  *                 type: string
  *                 example: a
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
  let myFriendListWithMutualCount = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
     return friendsManager
         .myFriendListWithMutualCount(userid,req)
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
  *     - name: Accept-Language
  *       in: header   
  *       description: Language
  *       required: false
  *       type: string
  *     - name: page
  *       in: query   
  *       description: page
  *       required: false
  *       type: number
  *     - name: limit
  *       in: query   
  *       description: page
  *       required: false
  *       type: number
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               keyword:
  *                 type: string
  *                 example: a
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
  let myBlockedFriendListWithMutualCount = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;    
     return friendsManager
         .myBlockedFriendListWithMutualCount(userid,req)
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
  *     - name: Accept-Language
  *       in: header   
  *       description: Language
  *       required: false
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
  *               uuid:
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
         .unBlockFriend(userid,req.body.friends_id,req,req.body.uuid)
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
  * /api/v1/friends/all_user_list:
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
  *     - name: Accept-Language
  *       in: header   
  *       description: Language
  *       required: false
  *       type: string
  *     - name: page
  *       in: query   
  *       description: page
  *       required: false
  *       type: number
  *     - name: limit
  *       in: query   
  *       description: page
  *       required: false
  *       type: number
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               keyword:
  *                 type: string
  *                 example: a
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
   let allUserList = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
     return friendsManager
         .allUserList(userid,req)
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
  * /api/v1/friends/my_incoming_friend_requests:
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
  *     - name: Accept-Language
  *       in: header   
  *       description: Language
  *       required: false
  *       type: string
  *     - name: page
  *       in: query   
  *       description: page
  *       required: false
  *       type: number
  *     - name: limit
  *       in: query   
  *       description: page
  *       required: false
  *       type: number
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               keyword:
  *                 type: string
  *                 example: a
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
   let myIncomingFriendRequest = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;    
     return friendsManager
         .myIncomingFriendRequest(userid,req)
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
    unBlockFriend:unBlockFriend,
    allUserList:allUserList,
    myIncomingFriendRequest:myIncomingFriendRequest   
 };