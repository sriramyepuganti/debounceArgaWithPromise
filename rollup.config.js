const typescript = require('rollup-plugin-typescript2');

module.exports = {
    input: 'index.ts',
    output: [
        {
            preserveModules: true,
            dir: 'lib/cjs',
            format: 'cjs'
            
        },
        {
            format: 'esm',
            dir: 'lib/es',
            preserveModules: true
        },
    ],
    plugins: [
         typescript({
            tsconfig: './tsconfig.json'
        })
    ]
}
