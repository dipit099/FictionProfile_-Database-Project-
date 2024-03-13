const pool = require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
const authorize = require('./middleware/authorize');
const AccountRoute = require('./routes/account/AccountRoute');
const UserMediaRoute = require('./routes/components/UserMediaAdd');
const UserFavoriteRoute = require('./routes/components/UserFavorite');




app.use(cors());
app.use(express.json());

app.use('/register', require('./routes/login/RegisterRoute'));
app.use('/login', require('./routes/login/LoginRoute'));
app.use('/trending', require('./routes/home/HomeMediaRoute'));
app.use('/movie', require('./routes/components/MovieDetails'));
app.use('/tv', require('./routes/components/TvShowDetails'));
app.use('/book', require('./routes/components/BookDetails'));
app.use('/manga', require('./routes/components/MangaDetails'));
app.use('/account', AccountRoute);
app.use('/user_media_add', UserMediaRoute);
app.use('/user_favorite', UserFavoriteRoute);
app.use('/top_media', require('./routes/home/TopMediaRoute'));
app.use('/discover', require('./routes/discover/DiscoverRoute'));
app.use('/feed', require('./routes/feed/FeedRoute'));
app.use('/moderator', require('./routes/moderator/ModeratorRoute'));
app.use('/rating', require('./routes/components/MediaRatingRoute'));
app.use('/review', require('./routes/components/MediaReviewRoute'));
app.use('/dashboard', require('./routes/user_dashboard/DashboardRoute'));
app.use('/user_announcement', require('./routes/components/UserAnnouncementRoute'));




// Define the function to call the procedure
const callProcedure = async () => {
    try {
        // Call the stored procedure to assign popularity index
        await pool.query('CALL "Fiction Profile"."assign_popularity_index"();');
        console.log('Procedure called successfully');
    } catch (error) {
        console.error('Error calling procedure:', error);
    }
};

// Call the procedure initially when the server starts
callProcedure();

// Call the procedure every 10 minutes (600,000 milliseconds)
setInterval(async () => {
    try {
        // Call the function
        await callProcedure();
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
}, 10 * 60 * 1000); // 10 minutes in milliseconds



app.get('/auth-verify', authorize, async (req, res) => {
    try {
        // if it passes authorization than it is valid
        //console.log("in auth-verify url");
        res.json(true);
    }
    catch (err) {
        console.error("verify url" + err.message);
        res.status(500).send('Server Error');
    }
});



const PORT = 5197;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});














