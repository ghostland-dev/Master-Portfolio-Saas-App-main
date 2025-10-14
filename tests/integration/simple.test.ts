// Test d'intégration simple pour vérifier que les tests fonctionnent
describe('Simple Integration Test', () => {
  it('should pass basic integration test', () => {
    expect(true).toBe(true)
  })

  it('should handle basic math operations', () => {
    expect(2 + 2).toBe(4)
    expect(10 - 5).toBe(5)
    expect(3 * 4).toBe(12)
    expect(8 / 2).toBe(4)
  })

  it('should handle string operations', () => {
    const greeting = 'Hello'
    const name = 'World'
    const message = `${greeting} ${name}!`
    
    expect(message).toBe('Hello World!')
    expect(message.length).toBe(12)
  })

  it('should handle array operations', () => {
    const numbers = [1, 2, 3, 4, 5]
    const doubled = numbers.map(n => n * 2)
    const sum = numbers.reduce((acc, n) => acc + n, 0)
    
    expect(doubled).toEqual([2, 4, 6, 8, 10])
    expect(sum).toBe(15)
  })
})
