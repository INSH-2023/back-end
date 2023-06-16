const role = Object.freeze({
    Super_admin: 'super_admin',
    Admin_it: 'admin_it',
    Admin_pr: 'admin_pr',
    User: 'user'
})

const status = Object.freeze({
    Active: 'active',
    Inactive: 'inactive'
})

module.exports.STATUS = status
module.exports.ROLE = role