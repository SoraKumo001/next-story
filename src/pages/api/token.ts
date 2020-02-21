import expressSession from "express-session";
const session = expressSession({
  secret: "nextjs"
});
export default (req, res) => {
  session(req, res, () => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ token: req.session }));
  });
};
