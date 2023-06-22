import ReviewsDAO from "../dao/ReviewsDAO.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const bookId=parseInt(req.body.bookId)
      //const bookId=req.body.bookId
      const review=req.body.review
      const user=req.body.user
       // Convert bookId to a number if it's a string
    
      
      console.log('bookId', bookId);
    
      const reviewResponse=await ReviewsDAO.addReview(bookId, user, review);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetReview(req, res, next) {
    try {
      const reviewId = req.params.id;
      const review = await ReviewsDAO.getReview(reviewId);

      if (!review) {
        res.status(404).json({ error: "Not Found" });
        return;
      }

      res.json(review);
    } catch (e) {
      console.log(`apiGetReview: ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.params.id;
      const review = req.body.review;
      const user = req.body.user;

      const reviewResponse = await ReviewsDAO.updateReview(reviewId, user, review);

      if (reviewResponse.error) {
        res.status(400).json({ error: reviewResponse.error });
      } else if (reviewResponse.modifiedCount === 0) {
        res.status(404).json({ error: "apiUpdateReview: Unable to update review" });
      } else {
        res.json({ status: "success" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.params.id;
      await ReviewsDAO.deleteReview(reviewId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetReviews(req, res, next) {
    try {
      const bookId = req.params.id;
      const reviews = await ReviewsDAO.getReviewsByBookId(bookId);

      if (!reviews) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      res.json(reviews);
    } catch (e) {
      console.log(`apiGetReviews: ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
