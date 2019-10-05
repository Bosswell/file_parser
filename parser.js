const parserButton = document.getElementById('parser-button');

parserButton.addEventListener('click', () => {
    const idObservationLen = parseInt(document.getElementById('idLen').value);
    const range = 20;

    const text = document.getElementById('text').value;
    const lines = text.split(/\r\n|\r|\n/);
    
    if (!Number.isInteger(idObservationLen)) {
        Swal.fire({
            text: 'Wpisano niepoprawną wartość dla pola definiującego długośc identyfikatora obserwacji',
            title: 'Błąd!',
            type: 'error',
            confirmButtonText: 'Ok'
        })

        return;
    }
    
    let parsedArray = [];
    let n = 0;
    let i = 0;
    let prevLine = '';
    let secondRow = '';
    let lastObservationId = '';

    let warnings = [];

    lines.forEach((line, index) => {
        if (!/\s/.test(line)) {
            if (i !== 0) {
                parsedArray.push(secondRow);
                i = 0;
            }
        
            if (n < 2 && n >= 0) {
                if (n === 0) {
                    lastObservationId = line;
                }
                parsedArray.push(line);
            } else if (n > 0) {
                n = -2;
            }
            n++;
            
            return;
        }

        id = line.split(/\s/)[0];

        if (id.length === idObservationLen) {
            line = '$' + line;
        }

        if (i++ == 2) {
            let instantPrevLine = lines[index - 1].split(/\s/);

            if (id.replace('$', '') !== instantPrevLine[0].replace('$', '')) {
                parsedArray.push(line);
                for (j = 1; j < instantPrevLine.length - 1; j++) {
                    let value = instantPrevLine[j];
                    let splitedValue = value.split('.');
                    let afterComma = parseInt(splitedValue[1]);
                    let max = afterComma + range;
                    let min = afterComma - range;
                    
                    afterComma = Math.floor(Math.random() * (max - min)) + min;
                    instantPrevLine[j] = `${splitedValue[0]}.${afterComma}`; 
                }
                instantPrevLine = instantPrevLine.join(' ');

                warnings.push({
                    'message': `Nie wykonano drugiego pomiaru dla wpisu o <b>id = ${lastObservationId}</b>.`,
                    'prevValue': lines[index - 1],
                    'currentVal': instantPrevLine,
                });

                secondRow = `$${instantPrevLine}`;
                return;
            }
            secondRow = line;

            return;
        }

        if (prevLine === line) {
            return;
        }

        if (lines.length === index + 1) {
            parsedArray.push(secondRow);
            
            return;
        }

        prevLine = line;
        parsedArray.push(line);
    });

    document.getElementById('result').value = parsedArray.join('\n');

    warnings.forEach((warning) => {
        Swal.fire({
            html: `<div class="pop-message">${warning.message} <br> Dodano drugi pomiar, który został utworzony na podstawie pierwszego:<br> [${warning.prevValue}] <br> dodano ---><br>[${warning.currentVal}]</div>`,
            title: 'Uwaga!',
            type: 'info',
            confirmButtonText: 'Ok'
        })
    });
});

