export const getEnv = (envname) => {
    return process.env[`REACT_APP_${envname}`]
}
