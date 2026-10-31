// Garante que os tipos gerados podem ser importados como o app vai importar. Roda em `npm run typecheck`.
import type { Care, Identity, Notification } from '../generated/ts/index.js';

type Idoso = Care.components['schemas']['Idoso'];
type DispararSos = Care.paths['/api/v1/idosos/{idosoId}/sos']['post'];
type Perfil = Identity.components['schemas']['Perfil'];
type RegistrarTokenPush = Notification.components['schemas']['RegistrarTokenPushRequest'];

const idoso: Pick<Idoso, 'id' | 'nomeCompleto' | 'dataNascimento'> = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  nomeCompleto: 'Maria Aparecida da Silva',
  dataNascimento: '1945-03-12',
};

const corpoSos: NonNullable<DispararSos['requestBody']>['content']['application/json'] = {
  latitude: -23.55052,
  longitude: -46.633308,
  nivelBateria: 85,
};

const statusSos: Care.components['schemas']['StatusAlarme'] = 'EM_ATENDIMENTO';

const perfil: Pick<Perfil, 'tipo' | 'nome'> = { tipo: 'IDOSO', nome: idoso.nomeCompleto };

const tokenPush: RegistrarTokenPush = {
  token: 'token-do-aparelho',
  identificadorAparelho: 'aparelho-1',
  plataforma: 'ANDROID',
};

export { corpoSos, perfil, statusSos, tokenPush };
