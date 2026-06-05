import api from './api'

export const profileService = {
  get(usuarioId) {
    return api.get(`/perfil/${usuarioId}`)
  },

  updateImages(usuarioId, data) {
    return api.put(`/perfil/actualizar/${usuarioId}`, null, {
      params: {
        imagenPerfilUrl: data.imagenPerfil,
        imagenPortadaUrl: data.imagenPortada,
      },
    })
  },
}
