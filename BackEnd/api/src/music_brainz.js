const mb = require('musicbrainz');


function get_mbid(release, artist, done) {
    mb.searchReleases(release, {artist: artist}, function (err, releases) {
        if (err)
            return done(err);

        if (!releases || releases.length <= 0)
            return done("Not found");

        return done(null, releases[0].id);
    });
}


module.exports={
    get_mbid:get_mbid
};