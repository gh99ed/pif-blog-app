export const deleteData = async (endpoint) => {
    const confirmed = window.confirm('Are you sure you want to delete this data?')
    if (!confirmed) return false

    try {
        const response = await fetch(endpoint, {
            method: 'DELETE',
            credentials: 'include',
        })
        const data = await response.json()

        if (!response.ok) {
            throw new Error(response.statusText)
        }

        return true
    } catch (error) {
        console.error('Delete error:', error)
        return false
    }
}
