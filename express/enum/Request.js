const status = Object.freeze({
    Request: 'request',
    OpenCase: 'open_case',
    InProgress: 'in_progress',
    Finish: 'finish'
})

const useType = Object.freeze({
    Organization: 'or',
    Self: 'sf',
})

const service = Object.freeze({
    Admin_it: "IT_Service",
    Admin_pr: "PR_Service"
})

const problem = Object.freeze({
    Hardware: 'hardware',
    Software: 'software',
    Internet: 'internet',
    Printer: 'printer',
    Website: 'website',
    Meeting: 'meeting',
    Application: 'application',
    Media: 'media',
    News: 'news',
    ALL: 'all'
})

module.exports.STATUS = status
module.exports.USETYPE = useType
module.exports.SERVICE = service
module.exports.PROBLEM = problem