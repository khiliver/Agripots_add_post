import 'package:flutter/material.dart';
import 'package:dialog_flowtter/dialog_flowtter.dart';

class ChatbotWidget extends StatefulWidget {
  const ChatbotWidget({super.key});

  @override
  State<ChatbotWidget> createState() => _ChatbotWidgetState();
}

class _ChatbotWidgetState extends State<ChatbotWidget> {
  late DialogFlowtter dialogFlowtter;
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, dynamic>> _messages = [];

  @override
  void initState() {
    super.initState();
    DialogFlowtter.fromFile().then((instance) => dialogFlowtter = instance);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 300,
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text(
              'AgriBot Assistant',
              style: Theme.of(context).textTheme.titleLarge,
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                return Container(
                  padding: const EdgeInsets.symmetric(
                    vertical: 8,
                    horizontal: 16,
                  ),
                  child: Row(
                    mainAxisAlignment: _messages[index]['isUser']
                        ? MainAxisAlignment.end
                        : MainAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: _messages[index]['isUser']
                              ? Theme.of(context).primaryColor
                              : Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          _messages[index]['message'],
                          style: TextStyle(
                            color: _messages[index]['isUser']
                                ? Colors.white
                                : Colors.black,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      hintText: 'Type a message...',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.send),
                  onPressed: () => _sendMessage(_controller.text),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _sendMessage(String text) async {
    if (text.isEmpty) return;

    setState(() {
      _messages.add({
        'message': text,
        'isUser': true,
      });
    });
    _controller.clear();

    final response = await dialogFlowtter.detectIntent(
      queryInput: QueryInput(text: TextInput(text: text)),
    );

    if (response.message == null) return;

    setState(() {
      _messages.add({
        'message': response.message?.text?.text?[0] ?? 'Error occurred',
        'isUser': false,
      });
    });
  }

  @override
  void dispose() {
    dialogFlowtter.dispose();
    super.dispose();
  }
}