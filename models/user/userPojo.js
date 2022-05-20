export default function user(data) {

    let _user = {}
    _user.username = data.username;
    _user.timestamp = data.timestamp;
    _user.grants = data.grants;
    _user.profiledata = data.profiledata;
    return _user;

}