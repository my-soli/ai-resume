import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai/data/models/ai_result_model.dart';
import 'package:resume_ai/services/api_client.dart';

final aiRepositoryProvider = Provider<AIRepository>(
  (ref) => AIRepository(ref.read(apiClientProvider)),
);

class AIRepository {
  final ApiClient _client;

  AIRepository(this._client);

  Future<AIResultModel> generateResume(String resumeId) async {
    final response =
        await _client.post('/ai/generate', data: {'resume_id': resumeId});
    return AIResultModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<AIResultModel> improveResume(String resumeId) async {
    final response =
        await _client.post('/ai/improve', data: {'resume_id': resumeId});
    return AIResultModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<AIResultModel> scoreResume(String resumeId) async {
    final response =
        await _client.post('/ai/score', data: {'resume_id': resumeId});
    return AIResultModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<AIResultModel?> getLatestResult(String resumeId) async {
    final response =
        await _client.get('/ai/results/$resumeId/latest');
    if (response.data == null) return null;
    return AIResultModel.fromJson(response.data as Map<String, dynamic>);
  }
}
