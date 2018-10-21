exports.sanitiseId = (id)=>{
    return id.split(" ").join("-").toLowerCase().split("'").join("");
}