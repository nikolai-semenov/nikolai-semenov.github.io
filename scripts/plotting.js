function mean(arr) {
    if (arr.length) {
        return arr.reduce((x, y) => {return x + y; }) / arr.length;
    }
}

function linear_plot(x, y_s, y_range, xlabel, ylabel, names, title, id) {
    let data = [];
    for (let i = 0; i < y_s.length; ++i) {
        data.push(
            {
                name: names[i],
                x: x,
                y: y_s[i],
                mode: 'lines+markers',
                type: 'scatter'
            }
        );
    }
    let layout = {
            yaxis: {
            title: ylabel,
            range: y_range
        },
        xaxis: {
            title: xlabel
        },
        title: title
    };
    Plotly.newPlot(id, data, layout);
}

function linear_grades_plot(data, title, id) {
    x = data.map(row => row.semester).filter((v, i, a) => a.indexOf(v) === i).map(Number)
    average = []
    rolling_average = []
    for (let i of x) {
        average.push(data.filter(row => row.semester == i).map(row => Number(row.mark)));
        rolling_average.push(data.filter(row => row.semester <= i).map(row => Number(row.mark)));
    }
    average = average.map(mean);
    rolling_average = rolling_average.map(mean);
    linear_plot(x, [average, rolling_average], checked ? [0, 5.1] : [0, 10.1], 'Semester', 'Grade', ['Average', 'Rolling average'], title, id);

}

function ten_to_five(mark) {
    if (mark > 7) {
        return 5;
    } else if (mark > 4) {
        return 4;
    } else if (mark > 2) {
        return 3;
    }
    return mark;
}

var checked = false;

function plot_all() {
    Plotly.d3.csv('data/marks.csv', data => {
        checked = document.getElementById("five_point").checked;
        if (checked) {
            data = data.map(row => {
                row.mark = ten_to_five(row.mark);
                return row;
            });
        } 
        linear_grades_plot(data, 'MIPT bachelor results', 'mipt_grades');
        linear_grades_plot(data.filter(row => row.math == 1), 'Math', 'math_grades');
        linear_grades_plot(data.filter(row => row.cs == 1), 'Computer science', 'cs_grades');
        linear_grades_plot(data.filter(row => row.physics == 1), 'Physics', 'phys_grades');
    });
}

plot_all();