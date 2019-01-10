exports.sanitiseId = (id)=>{
    return id
            .split(" ").join("-")
            .split("'").join("")
            .split("#").join("")
            .split("?").join("")
            .toLowerCase();
}