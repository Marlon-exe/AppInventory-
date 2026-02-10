export class Utils {
  static serverResponse({
    response,
    msg,
    value,
    data,
    error,
    code,

  }) {
    return response.status(code).json({
      msg,
      value,
      data,
      error
    })

  }
}