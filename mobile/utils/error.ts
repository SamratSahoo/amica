import { EndExecutionError } from "./types";


interface ErrorWrapperArgs {
    /*eslint-disable */
    functionToExecute: Function;
    errorHandler: Function;
    /*eslint-enable */

    parameters?: Array<any>;
    customErrors?: Record<string, string>;
    errorFunctionParams?: Array<any>;
}
export const ErrorWrapper = async ({
    functionToExecute,
    errorHandler,
    parameters,
    customErrors,
    errorFunctionParams,
}: ErrorWrapperArgs) => {
    if (!parameters) {
        parameters = [];
    }

    if (!errorFunctionParams) {
        errorFunctionParams = [];
    }

    const result = await functionToExecute(...parameters)
        .catch((e: Error) => {
            if (!errorHandler) {
                throw new EndExecutionError("");
            }
            if (customErrors) {
                if (Object.getOwnPropertyNames(customErrors).includes(e.message)) {
                    errorHandler(
                        customErrors[e.message],
                        ...(errorFunctionParams as Array<any>)
                    );
                } else if (
                    Object.getOwnPropertyNames(customErrors).includes("default")
                ) {
                    errorHandler(
                        customErrors["default"],
                        ...(errorFunctionParams as Array<any>)
                    );
                }
                throw new EndExecutionError("");
            }
            errorHandler(
                (e as Error).message,
                ...(errorFunctionParams as Array<any>)
            );
            throw new EndExecutionError("");
        })
        .then((result: any) => {
            return result;
        });

    return result;
};

export const endOfExecutionHandler = (e: Error) => {
    if (e instanceof EndExecutionError) {
        return;
    }

    throw e;
};
