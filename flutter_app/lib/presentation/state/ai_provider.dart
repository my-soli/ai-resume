import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai/data/models/ai_result_model.dart';
import 'package:resume_ai/data/repositories/ai_repository.dart';
import 'package:resume_ai/presentation/state/subscription_provider.dart';

final aiResultProvider =
    AsyncNotifierProviderFamily<AIResultNotifier, AIResultModel?, String>(
        AIResultNotifier.new);

class AIResultNotifier
    extends FamilyAsyncNotifier<AIResultModel?, String> {
  @override
  Future<AIResultModel?> build(String arg) async {
    return ref.read(aiRepositoryProvider).getLatestResult(arg);
  }

  Future<void> generate() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(aiRepositoryProvider).generateResume(arg));
    _refreshUsage();
  }

  Future<void> improve() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(aiRepositoryProvider).improveResume(arg));
    _refreshUsage();
  }

  Future<void> score() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
        () => ref.read(aiRepositoryProvider).scoreResume(arg));
    _refreshUsage();
  }

  void _refreshUsage() => ref.invalidate(aiUsageProvider);
}
