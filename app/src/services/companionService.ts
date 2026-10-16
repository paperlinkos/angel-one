/** Integration boundary: replace these demo methods with approved ministry providers later. */
export const companionService = {
  async searchTeachings(query: string) {
    const library = [
      { title: 'The Divine Life in You', teacher: 'Sample PCDL-style teaching', length: '42 min', tags: ['identity', 'life'] },
      { title: 'The Ministry of Prayer', teacher: 'Sample PCDL-style teaching', length: '31 min', tags: ['prayer', 'faith'] },
      { title: 'Living by the Word', teacher: 'Sample PCDL-style teaching', length: '38 min', tags: ['word', 'growth'] },
    ]
    return library.filter(item => `${item.title} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  },
  speak(text: string) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = .92
    window.speechSynthesis.speak(utterance)
  }
}
