const parserButton = document.getElementById('parser-button');

parserButton.addEventListener('click', () => {
    const text = document.getElementById('text').value;
    const lines = text.split(/\r\n|\r|\n/);
    let newArray = [];
    let n = 0;
    let i = 0;
    let prevLine = '';
    let secondRow = '';

    lines.forEach((line, index) => {
        if (!/\s/.test(line)) {
            if (i !== 0) {
                newArray.push(secondRow);
                i = 0;
            }
        
            if (n < 2 && n >= 0) {
                newArray.push(line);
            } else if (n > 0) {
                n = -2;
            }
            n++;
            
            return;
        }

        if (line.split(/\s/)[0].length === 7) {
            line = '$' + line;
        }

        if (i++ == 2) {
            secondRow = line;

            return;
        }

        if (prevLine === line) {

            return;
        }

        if (lines.length === index + 1) {
            newArray.push(secondRow);
            
            return;
        }

        prevLine = line;
        newArray.push(line);
    });

    document.getElementById('result').value = newArray.join('\n');
});

