const express = require("express");
const multer = require("multer");
const path = require("path");
const { auth, restrictTo } = require("../middlewares/auth");
const {
  getAllLists,
  deleteList,
  getSingleList,
  searchByCategory,
  updateList,
  addNewList,
  acceptDataList,
  getAllListsUserView,
  searchByCategoryFalse,
  searchByName,
  getListsForAll,
  getListsForMe,
  toggleVisibility,
  updateVisibility,
  getDashboardData,
  saveList,
  addNewPost,
  publishPost,
} = require("../controllers/listController");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../postImages"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();
router.post("/save-list", auth, saveList);
router.patch(
  "/accept/:listId/:userId",
  auth,
  restrictTo("admin", "supervisor", "owner"),
  acceptDataList
);
router.get("/search", searchByCategory);
router.get("/searchName", searchByName);

router.get(
  "/searchFalse",
  auth,
  restrictTo("admin", "supervisor", "owner"),
  searchByCategoryFalse
);
router.get("/", getAllLists);
router.get("/userView", getAllListsUserView);
router.post(
  "/:userId",
  auth,
  upload.fields([
    { name: "documents", maxCount: 10 },
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  addNewList
);
//save post
router.post(
  "/posts/:userId",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  addNewPost
);
//publish post
router.post('/posts/:userId/publish/:postId',auth, publishPost);
router.delete("/:id/:userId", auth, restrictTo("admin", "owner"), deleteList);
router.get("/:id", getSingleList);
router.patch(
  "/:id/:userId",
  auth,
  //restrictTo('admin', 'supervisor', 'owner'),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
    //{ name: 'documents', maxCount: 10 }
  ]),
  updateList
);

//get lists for all
router.get("/getLists/forAll", auth, getListsForAll);
//get lists for me
router.get("/getLists/forMe", auth, getListsForMe);
router.put("/toggle-visibility/:id", auth, toggleVisibility);
router.put("/updateVisibility/:postId", auth, updateVisibility);
router.get("/dashboardData", auth, getDashboardData);
module.exports = router;
