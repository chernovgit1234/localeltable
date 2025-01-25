/* eslint-disable */

import  {createToken, Lexer} from 'chevrotain'
// the vocabulary will be exported and used in the Parser definition.
export const tokenVocabulary: any = {};

const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: Lexer.SKIPPED,
});

const String = createToken({
    name: 'String',
    pattern: /"(""|[^"])*"/
});

const SingleQuotedString = createToken({
    name: 'SingleQuotedString',
    pattern: /'(''|[^'])*'/
});

const SheetQuoted = createToken({
    name: 'SheetQuoted',
    pattern: /'((?![\\\/\[\]*?:]).)+?'!/
});

const Function = createToken({
    name: 'Function',
    pattern: /[A-Za-z_]+[A-Za-z_0-9.]/
});

const FormulaErrorT = createToken({
    name: 'FormulaErrorT',
    pattern: /#NULL!|#DIV\/0!|#VALUE!|#NAME\?|#NUM!|#N\/A/
});

const RefError = createToken({
    name: 'RefError',
    pattern: /#REF!/
});

const Name = createToken({
    name: 'Name',
    pattern: /[a-zA-Z_][a-zA-Z0-9_.?]*/,
    // longer_alt: RangeColumn // e.g. A:AA
});

const Sheet = createToken({
    name: 'Sheet',
    pattern: /[A-Za-z_.\d\u007F-\uFFFF]+!/
});

const Cell = createToken({
    name: 'Cell',
    pattern: /[$]?[A-Za-z]{1,3}[$]?[1-9][0-9]*/,
    longer_alt: Name
});

const Number = createToken({
    name: 'Number',
    pattern: /[0-9]+[.]?[0-9]*([eE][+\-][0-9]+)?/
});

const Boolean = createToken({
    name: 'Boolean',
    pattern: /TRUE|FALSE/i
});

const Column = createToken({
    name: 'Column',
    pattern: /[$]?[A-Za-z]{1,3}/,
    longer_alt: Name
});


/**
 * Symbols and operators
 */
const At = createToken({
    name: 'At',
    pattern: /@/
});

const Comma = createToken({
    name: 'Comma',
    pattern: /,/
});

const Colon = createToken({
    name: 'Colon',
    pattern: /:/
});

const Semicolon = createToken({
    name: 'Semicolon',
    pattern: /;/
});

const OpenParen = createToken({
    name: 'OpenParen',
    pattern: /\(/
});

const CloseParen = createToken({
    name: 'CloseParen',
    pattern: /\)/
});

const OpenSquareParen = createToken({
    name: 'OpenSquareParen',
    pattern: /\[/
});

const CloseSquareParen = createToken({
    name: 'CloseSquareParen',
    pattern: /]/
});

const ExclamationMark = createToken({
    name: 'exclamationMark',
    pattern: /!/
});

const OpenCurlyParen = createToken({
    name: 'OpenCurlyParen',
    pattern: /{/
});

const CloseCurlyParen = createToken({
    name: 'CloseCurlyParen',
    pattern: /}/
});

const QuoteS = createToken({
    name: 'QuoteS',
    pattern: /'/
});


const MulOp = createToken({
    name: 'MulOp',
    pattern: /\*/
});

const PlusOp = createToken({
    name: 'PlusOp',
    pattern: /\+/
});

const DivOp = createToken({
    name: 'DivOp',
    pattern: /\//
});

const MinOp = createToken({
    name: 'MinOp',
    pattern: /-/
});

const ConcatOp = createToken({
    name: 'ConcatOp',
    pattern: /&/
});

const ExOp = createToken({
    name: 'ExOp',
    pattern: /\^/
});

const PercentOp = createToken({
    name: 'PercentOp',
    pattern: /%/
});

const GtOp = createToken({
    name: 'GtOp',
    pattern: />/
});

const EqOp = createToken({
    name: 'EqOp',
    pattern: /=/
});

const LtOp = createToken({
    name: 'LtOp',
    pattern: /</
});

const NeqOp = createToken({
    name: 'NeqOp',
    pattern: /<>/
});

const GteOp = createToken({
    name: 'GteOp',
    pattern: />=/
});

const LteOp = createToken({
    name: 'LteOp',
    pattern: /<=/
});

// The order of tokens is important
const allTokens = [

    WhiteSpace,
    String,
    SheetQuoted,
    SingleQuotedString,
    Function,
    FormulaErrorT,
    RefError,
    Sheet,
    Cell,
    Boolean,
    Column,
    Name,
    Number,

    At,
    Comma,
    Colon,
    Semicolon,
    OpenParen,
    CloseParen,
    OpenSquareParen,
    CloseSquareParen,
    // ExclamationMark,
    OpenCurlyParen,
    CloseCurlyParen,
    QuoteS,
    MulOp,
    PlusOp,
    DivOp,
    MinOp,
    ConcatOp,
    ExOp,
    MulOp,
    PercentOp,
    NeqOp,
    GteOp,
    LteOp,
    GtOp,
    EqOp,
    LtOp,
];

/* const mathOperatorsTokens = [
    At,
    Comma,
    Colon,
    Semicolon,
    OpenParen,
    CloseParen,
    OpenSquareParen,
    CloseSquareParen,
    OpenCurlyParen,
    CloseCurlyParen,
    QuoteS,
    MulOp,
    PlusOp,
    DivOp,
    MinOp,
    ConcatOp,
    ExOp,
    MulOp,
    PercentOp,
    NeqOp,
    GteOp,
    LteOp,
    GtOp,
    EqOp,
    LtOp
]; */

const SelectLexer = new Lexer(allTokens, {ensureOptimizations: true});
/* const SelectMathLexer = new Lexer(mathOperatorsTokens, {ensureOptimizations: true}); */

allTokens.forEach(tokenType => {
    tokenVocabulary[tokenType.name] = tokenType
});


export function lex(inputText: any) {
    const lexingResult = SelectLexer.tokenize(inputText)
    let tokens = lexingResult.tokens
    return tokens
}

/* export function mathOperatorLex(inputText: any) {
    const lexingResult = SelectMathLexer.tokenize(inputText)
    let tokens = lexingResult.tokens
    
    return tokens
} */

