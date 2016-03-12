
// Terminal object
// Allows for controlling the terminal by outputting control characters
var terminal = {
    // Terminal escape character
    // escape_code: '\033',
    escape_code: '\x1B',

    // Display attributes reset
    // reset_code: '\033[0m',
    reset_code: '\x1B[0m',

    // Write a message in the terminal
    write: function(message) {
        process.stdout.write(message);
        return this;
    },

    // Print one or more new line characters
    nl: function(n) {
        n = n || 1;
        for (var i = 0; i < n; i++) {
            process.stdout.write('\n');
        }
        return this;
    },

    // Move the terminal cursor
    move: function(x, y) {
        x = x || 0;
        y = y || 0;

        var command = this.escape_code + '[';
        if (undefined !== x && 0 < x) {
            command += ++x;
        }
        if (undefined !== y && 0 < y) {
            command += ';' + ++y ;
        }

        process.stdout.write(command + 'H');
        return this;
    },

    // Move the terminal cursor up `x` positions
    up: function(x) {
        process.stdout.write(this.escape_code + '[' + x + 'A');
        return this;
    },

    // Move the terminal cursor down x positions
    down: function(x) {
        process.stdout.write(this.escape_code + '[' + x + 'B');
        return this;
    },

    // Move the terminal cursor `p` positions right
    right: function(p) {
        process.stdout.write(this.escape_code + '[' + p + 'C');
        return this;
    },

    // Move the terminal cursor `p` positions left
    left: function(p) {
        process.stdout.write(this.escape_code + '[' + p + 'D');
        return this;
    },

    // Clear all characters from the terminal screen
    clear: function() {
        process.stdout.write(this.escape_code + '[2J');
        return this;
    },

    // Clear the line the cursor is at
    clearLine: function() {
        process.stdout.write(this.escape_code + '[2K');
        return this;
    },

    // Clear the next `n` characters from the current cursor position.
    clearCharacters: function(n) {
        this.write(new Array(n + 2).join(' ')).left(n + 2);
        return this;
    }
};

// Export the command object
module.exports = terminal;