var MYAPP = MYAPP || {};
MYAPP.core = {
    arrayUnique:function(data){
        var tmp = [];
        for(var k in data) {tmp[data[k]] = "";}
        data = [];
        for(var k in tmp) {data.push(k);}

        return data;
    }
};