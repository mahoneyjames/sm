exports.sanitiseId = (id)=>{
    return id
            .split(" ").join("-")
            .split("'").join("")
            .split("#").join("")
            .split("?").join("")
            .toLowerCase();
}

exports.groupBy = (items, keyGetter)=>{

    const groupedMap = items.reduce(
        (group, thing) => {
              const key  = keyGetter(thing);
              
              if(!group.has(key))
              {                
                  group.set(key, new Set());             
              }
              group.get(key).add(thing);
              return group;
            },
        new Map()
    );
    
    return groupedMap;
}



exports.groupByIsoDate = (items, dateFieldName)=>{

    return exports.groupBy(items, (item)=>{
        if(item[dateFieldName])
        {
            return item[dateFieldName].slice(0,4);
        }
        else
        {
            return "sometime";
        }
    });    
}

exports.mapToArray = (groupedMap, keyFieldName, valuesFieldName)=>{

    return Array.from(groupedMap.entries(),(entry)=>{
        const result = {};
        result[keyFieldName] = entry[0];
        result[valuesFieldName] = Array.from(entry[1]);
        
        return result;
    });
}