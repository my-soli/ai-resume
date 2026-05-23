import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai/data/models/resume_model.dart';
import 'package:resume_ai/data/repositories/resume_repository.dart';

final resumeListProvider =
    AsyncNotifierProvider<ResumeListNotifier, List<ResumeModel>>(
        ResumeListNotifier.new);

class ResumeListNotifier extends AsyncNotifier<List<ResumeModel>> {
  @override
  Future<List<ResumeModel>> build() async {
    return ref.read(resumeRepositoryProvider).getResumes();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(resumeRepositoryProvider).getResumes());
  }

  Future<ResumeModel> create(Map<String, dynamic> data) async {
    final resume =
        await ref.read(resumeRepositoryProvider).createResume(data);
    state = AsyncData([resume, ...state.value ?? []]);
    return resume;
  }

  Future<void> delete(String id) async {
    await ref.read(resumeRepositoryProvider).deleteResume(id);
    state = AsyncData(
      (state.value ?? []).where((r) => r.id != id).toList(),
    );
  }
}

final resumeDetailProvider =
    FutureProviderFamily<ResumeModel, String>((ref, id) {
  return ref.read(resumeRepositoryProvider).getResume(id);
});
