import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:resume_ai/core/constants/app_constants.dart';
import 'package:resume_ai/core/errors/app_exception.dart';

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

class ApiClient {
  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConstants.baseUrl,
        connectTimeout: AppConstants.connectTimeout,
        receiveTimeout: AppConstants.receiveTimeout,
        headers: {'Content-Type': 'application/json'},
      ),
    );

    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: _onRequest,
        onError: _onError,
      ),
    );
  }

  Future<void> _onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _storage.read(key: AppConstants.accessTokenKey);
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  Future<void> _onError(
    DioException error,
    ErrorInterceptorHandler handler,
  ) async {
    if (error.response?.statusCode == 401) {
      try {
        final refreshToken =
            await _storage.read(key: AppConstants.refreshTokenKey);
        if (refreshToken != null) {
          final response = await _dio.post(
            '/auth/refresh',
            data: {'refresh_token': refreshToken},
            options: Options(headers: {'Authorization': null}),
          );
          final newToken = response.data['access_token'];
          final newRefresh = response.data['refresh_token'];
          await _storage.write(key: AppConstants.accessTokenKey, value: newToken);
          await _storage.write(
              key: AppConstants.refreshTokenKey, value: newRefresh);

          error.requestOptions.headers['Authorization'] = 'Bearer $newToken';
          final retryResponse = await _dio.fetch(error.requestOptions);
          return handler.resolve(retryResponse);
        }
      } catch (_) {
        await _storage.deleteAll();
      }
    }
    handler.next(error);
  }

  Future<Response<T>> get<T>(String path,
      {Map<String, dynamic>? queryParameters}) async {
    try {
      return await _dio.get<T>(path, queryParameters: queryParameters);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  Future<Response<T>> post<T>(String path, {dynamic data}) async {
    try {
      return await _dio.post<T>(path, data: data);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  Future<Response<T>> patch<T>(String path, {dynamic data}) async {
    try {
      return await _dio.patch<T>(path, data: data);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  Future<Response<T>> delete<T>(String path) async {
    try {
      return await _dio.delete<T>(path);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  Future<Response<dynamic>> getBytes(String path) async {
    try {
      return await _dio.get(
        path,
        options: Options(responseType: ResponseType.bytes),
      );
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  AppException _mapError(DioException e) {
    final statusCode = e.response?.statusCode;
    final data = e.response?.data;

    // Try to get the backend's detail message first
    String? backendDetail;
    if (data is Map) {
      backendDetail = data['detail']?.toString();
    }

    String message;
    if (backendDetail != null && backendDetail.isNotEmpty) {
      message = backendDetail;
    } else if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout) {
      message = 'Request timed out. Check your connection and try again.';
    } else if (e.type == DioExceptionType.connectionError) {
      message = 'Could not reach the server. Check your connection and try again.';
    } else {
      message = _friendlyMessageForStatus(statusCode);
    }

    if (statusCode == 401) return AuthException(message, statusCode: statusCode);
    if (statusCode == 404) return NotFoundException(message);
    return NetworkException(message, statusCode: statusCode);
  }

  String _friendlyMessageForStatus(int? code) {
    switch (code) {
      case 400: return 'Invalid request. Please check your input.';
      case 401: return 'Session expired. Please sign in again.';
      case 402: return 'Upgrade to Pro to use this feature.';
      case 403: return 'You don\'t have permission to do this.';
      case 404: return 'The requested item was not found.';
      case 409: return 'A conflict occurred. The item may already exist.';
      case 422: return 'Some fields are invalid. Please check your input.';
      case 429: return 'Too many requests. Please wait a moment and try again.';
      case 500: return 'Something went wrong on our end. Please try again.';
      case 502:
      case 503: return 'Service temporarily unavailable. Please try again shortly.';
      default:  return 'Something went wrong. Please try again.';
    }
  }
}
