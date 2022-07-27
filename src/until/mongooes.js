module.exports = {
    ObtoOb: function (a){
        return a ? a.toObject() : a
    },
    ArtoOb: function (arr){
        return arr.map(item => item.toObject())
    }
}