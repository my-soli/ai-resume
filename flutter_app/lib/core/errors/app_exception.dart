class AppException implements Exception {
  final String message;
  final int? statusCode;

  const AppException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class NetworkException extends AppException {
  const NetworkException(super.message, {super.statusCode});
}

class AuthException extends AppException {
  const AuthException(super.message, {super.statusCode});
}

class NotFoundException extends AppException {
  const NotFoundException(super.message) : super(statusCode: 404);
}
