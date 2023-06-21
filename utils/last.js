 function last(params) {
    let week11 = []; let week12 = []; let week13 = []; let week14 = []; let week15 = [];
    let week21 = []; let week22 = []; let week23 = []; let week24 = []; let week25 = [];
    let week31 = []; let week32 = []; let week33 = []; let week34 = []; let week35 = [];
    let week41 = []; let week42 = []; let week43 = []; let week44 = []; let week45 = [];
    let week51 = []; let week52 = []; let week53 = []; let week54 = []; let week55 = [];
    let week61 = []; let week62 = []; let week63 = []; let week64 = []; let week65 = [];
    let week71 = []; let week72 = []; let week73 = []; let week74 = []; let week75 = [];
    params.forEach(element => {
        if (element.day_of_week == '周一' && element.time == '[01-02节]') {
            week11.push(element);
        } else if (element.day_of_week == '周一' && element.time == '[03-04节]') {
            week12.push(element);
        } else if (element.day_of_week == '周一' && element.time == '[05-06节]') {
            week13.push(element);
        } else if (element.day_of_week == '周一' && element.time == '[07-08节]') {
            week14.push(element);
        } else if (element.day_of_week == '周一' && element.time == '[09-10节]') {
            week15.push(element);
        } else if (element.day_of_week == '周二' && element.time == '[01-02节]') {          
            week21.push(element);
        } else if (element.day_of_week == '周二' && element.time == '[03-04节]') {
            week22.push(element);
        } else if (element.day_of_week == '周二' && element.time == '[05-06节]') {
            week23.push(element);
        } else if (element.day_of_week == '周二' && element.time == '[07-08节]') {
            week24.push(element);
        } else if (element.day_of_week == '周二' && element.time == '[09-10节]') {
            week25.push(element);
        } else if (element.day_of_week == '周三' && element.time == '[01-02节]') {
            week31.push(element);
        } else if (element.day_of_week == '周三' && element.time == '[03-04节]') {
            week32.push(element);
        } else if (element.day_of_week == '周三' && element.time == '[05-06节]') {
            week33.push(element);
        } else if (element.day_of_week == '周三' && element.time == '[07-08节]') {
            week34.push(element);
        } else if (element.day_of_week == '周三' && element.time == '[09-10节]') {
            week35.push(element);
        } else if (element.day_of_week == '周四' && element.time == '[01-02节]') {
            week41.push(element);
        } else if (element.day_of_week == '周四' && element.time == '[03-04节]') {
            week42.push(element);
        } else if (element.day_of_week == '周四' && element.time == '[05-06节]') {
            week43.push(element);
        } else if (element.day_of_week == '周四' && element.time == '[07-08节]') {
            week44.push(element);
        } else if (element.day_of_week == '周四' && element.time == '[09-10节]') {
            week45.push(element);
        } else if (element.day_of_week == '周五' && element.time == '[01-02节]') {
            week51.push(element);
        } else if (element.day_of_week == '周五' && element.time == '[03-04节]') {
            week52.push(element);
        } else if (element.day_of_week == '周五' && element.time == '[05-06节]') {
            week53.push(element);
        } else if (element.day_of_week == '周五' && element.time == '[07-08节]') {
            week54.push(element);
        } else if (element.day_of_week == '周五' && element.time == '[09-10节]') {
            week55.push(element);
        } else if (element.day_of_week == '周六' && element.time == '[01-02节]') {
            week61.push(element);
        } else if (element.day_of_week == '周六' && element.time == '[03-04节]') {
            week62.push(element);
        } else if (element.day_of_week == '周六' && element.time == '[05-06节]') {
            week63.push(element);
        } else if (element.day_of_week == '周六' && element.time == '[07-08节]') {
            week64.push(element);
        } else if (element.day_of_week == '周六' && element.time == '[09-10节]') {
            week65.push(element);
        } else if (element.day_of_week == '周日' && element.time == '[01-02节]') {
            week71.push(element);
        } else if (element.day_of_week == '周日' && element.time == '[03-04节]') {
            week72.push(element);
        } else if (element.day_of_week == '周日' && element.time == '[05-06节]') {
            week73.push(element);
        } else if (element.day_of_week == '周日' && element.time == '[07-08节]') {
            week74.push(element);
        } else if (element.day_of_week == '周日' && element.time == '[09-10节]') {
            week75.push(element);
        } 
    });

    return [week11, week12, week13, week14, week15, 
            week21, week22, week23, week24, week25,
            week31, week32, week33, week34, week35,
            week41, week42, week43, week44, week45,
            week51, week52, week53, week54, week55,
            week61, week62, week63, week64, week65,
            week71, week72, week73, week74, week75,]
}

module.exports = last;