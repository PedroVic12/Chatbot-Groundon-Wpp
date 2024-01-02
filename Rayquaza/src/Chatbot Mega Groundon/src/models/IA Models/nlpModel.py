
import speech_recognition as sr
from gtts import gTTS
import os
import playsound
import wikipedia
import webbrowser
import pyjokes
import pyaudio


class Robo:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()

    def get_audio(self):
        with self.microphone as source:
            try:
                self.recognizer.pause_threshold = 1
                self.recognizer.adjust_for_ambient_noise(source, 1)
                audio = self.recognizer.listen(source)
                said = self.recognizer.recognize_google(audio)
                print(said)
                return said.lower()
            except Exception as e:
                print("Não entendi: " + str(e))
                return ""

    def falar(self, texto):
        tts = gTTS(text=texto, lang='pt')
        fileName = 'voice.mp3'
        try:
            os.remove(fileName)
        except OSError:
            pass
        tts.save(fileName)
        playsound.playsound(fileName)

    def executar(self):
        while True:
            print('Estou ouvindo...')
            texto = self.get_audio()
            if 'olá' in texto:
                self.falar('Olá, como posso ajudar?')
            elif 'youtube' in texto:
                self.falar('Abrindo YouTube')
                url = 'https://www.youtube.com/'
                webbrowser.get().open(url)
            elif 'pesquisar' in texto:
                self.falar('Pesquisando na Wikipedia')
                query = texto.replace('pesquisar', '')
                result = wikipedia.summary(query, sentences=3)
                self.falar('De acordo com a Wikipedia')
                print(result)
                self.falar(result)
            elif 'piada' in texto:
                self.falar(pyjokes.get_joke())
            elif 'sair' in texto:
                self.falar('Até mais, Mestre Pedro')
                break


if __name__ == "__main__":
    robo = Robo()
    robo.executar()
