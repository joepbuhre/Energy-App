import bankapi from "../utils/nordigen"

const getTransactions = ():Promise<any>=> {
    return new Promise((resolve, reject) => {
        bankapi.get('/transactions/?date_from=2022-07-02&date_to=2022-09-30')
        .then(res => {
            resolve(res.data)
        })
        .catch(err => {
            reject(err.resposne)
        })
    })
}

export {
    getTransactions
}