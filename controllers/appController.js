export async function getHome(req, res) {
    res.render("home", {user: req.user})
}