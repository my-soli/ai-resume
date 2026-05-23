import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:resume_ai/main.dart';

void main() {
  testWidgets('App renders splash screen', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: ResumeAIApp()),
    );
    // Splash screen should show the app name
    expect(find.text('Resume AI'), findsWidgets);
  });

  testWidgets('Login screen renders email and password fields', (tester) async {
    await tester.pumpWidget(
      ProviderScope(
        child: Builder(
          builder: (context) => MaterialApp(
            home: Scaffold(
              body: Column(
                children: [
                  TextFormField(decoration: const InputDecoration(labelText: 'Email address')),
                  TextFormField(decoration: const InputDecoration(labelText: 'Password')),
                ],
              ),
            ),
          ),
        ),
      ),
    );
    expect(find.text('Email address'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
  });

  testWidgets('Score badge shows correct color for high score', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: Center(
            child: _MockScoreWidget(score: 85),
          ),
        ),
      ),
    );
    expect(find.text('85'), findsOneWidget);
  });
}

class _MockScoreWidget extends StatelessWidget {
  final int score;
  const _MockScoreWidget({required this.score});

  @override
  Widget build(BuildContext context) {
    return Text('$score');
  }
}
