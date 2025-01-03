import Express from "express";
import * as quotesController from "../controllers/quotes.js";
import * as validation from "../middleware/validation.js";
import cache from "./utilities/cacheGet.js";

const router = Express.Router();

router.get("/", quotesController.getQuotes);
router.post(
  "/",
  validation.setDefaultColor,
  validation.createQuote,
  quotesController.createQuote
);

router.get("/:id", (req, res, next) =>
  cache(req, res, next, quotesController.getQuote)
);
router.patch("/:id", quotesController.updateQuote);
router.delete("/:id", quotesController.deleteQuote);

router.post("/:id/likes", quotesController.createLike);
router.delete("/:id/likes", quotesController.deleteLike);

router.get("/:id/comments", (req, res, next) => {
  cache(req, res, next, quotesController.getComments);
});
router.post("/:id/comments", quotesController.createComment);

export default router;
