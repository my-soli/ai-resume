import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai/data/models/resume_model.dart';
import 'package:resume_ai/services/api_client.dart';

final resumeRepositoryProvider = Provider<ResumeRepository>(
  (ref) => ResumeRepository(ref.read(apiClientProvider)),
);

class ResumeRepository {
  final ApiClient _client;

  ResumeRepository(this._client);

  Future<List<ResumeModel>> getResumes() async {
    final response = await _client.get('/resumes');
    return (response.data as List)
        .map((e) => ResumeModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<ResumeModel> getResume(String id) async {
    final response = await _client.get('/resumes/$id');
    return ResumeModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<ResumeModel> createResume(Map<String, dynamic> data) async {
    final response = await _client.post('/resumes', data: data);
    return ResumeModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<ResumeModel> updateResume(
      String id, Map<String, dynamic> data) async {
    final response = await _client.patch('/resumes/$id', data: data);
    return ResumeModel.fromJson(response.data as Map<String, dynamic>);
  }

  Future<void> deleteResume(String id) async {
    await _client.delete('/resumes/$id');
  }

  Future<List<Map<String, dynamic>>> getVersions(String id) async {
    final response = await _client.get('/resumes/$id/versions');
    return List<Map<String, dynamic>>.from(response.data as List);
  }

  Future<List<int>> downloadPdf(String id) async {
    final response = await _client.getBytes('/resumes/$id/download');
    return List<int>.from(response.data as List);
  }
}
