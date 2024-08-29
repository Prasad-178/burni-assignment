import { StyleSheet, TextInput, Button } from "react-native";
import { Text, View } from "react-native";
import { initLlama } from "llama.rn";
import { useState } from "react";

export default function TabOneScreen() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const llama = async (userInput) => {
    console.log("input is : ", userInput)

    let context
    try {
        context = await initLlama({
          model: "C:/My_Files/Learning/Appdev/expo-demo-example/app/models/tinyllama-1.1b-chat-v0.3.Q3_K_L.gguf",
          use_mlock: true,
          n_gpu_layers: 0
        });
    } catch (err) {
        console.log("err is : ", err)
    }
    
    console.log("context is : ", context)

    const stopWords = [
      "</s>",
      "<|end|>",
      "<|eot_id|>",
      "<|end_of_text|>",
      "<|im_end|>",
      "<|EOT|>",
      "<|END_OF_TURN_TOKEN|>",
      "<|end_of_turn|>",
      "<|endoftext|>",
    ];

    let textResult
    try {
        textResult = await context!.completion(
          {
            prompt: `This is a conversation between user and llama, a friendly chatbot. respond in simple markdown.\n\nUser: ${userInput}\nLlama:`,
            n_predict: 100,
            stop: [...stopWords, "Llama:", "User:"],
          }
        );
    } catch (err) {
        console.log(err)
    }
    console.log("text result is : ", textResult)

    setResult(textResult!.text);
  };

  const handlePress = () => {
    llama(input);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with Llama</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your message"
        placeholderTextColor="#888"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Enter" onPress={handlePress} />
      {result ? (
        <Text style={styles.result}>{result}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    color: "#000",
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    color: "#333",
  },
});
