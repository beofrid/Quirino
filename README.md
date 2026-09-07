# Bem vindo ao sistema Quirino 

Link do projeto está aqui:
### https://beofrid.github.io/Quirino/




## Usuários para testes:

Rh SME (administrador): `beofrid@gmail.com`

Escola: `escola@email.com`

Pedagógico: `pedagogico@email.com`

Rh da Prefeitura: `rh@email.com`

Senha padrão: `admin123`



 ## Sobre o Sistema Quirino 

&emsp;&emsp;O Quirino foi criado para desburocratizar a gestão de contratações da Secretaria Municipal de Educação. Centraliza solicitações de escolas, aprovação do setor pedagógico e andamento pelo RH em um só local.

&emsp;&emsp;O nome é em homenagem a um excelente estagiário do setor que finalizou tempo máximo de contrato e precisou ser demitido e faz muita falta pra todo o setor.

### &emsp;&emsp; Esse projeto é real, e tenho objetivo de seguir implementando após a entrega e aplicar na prática ainda neste ano.

                        
## Status de implementação das páginas 06/09/2026

### Páginas com a indicação abaixo estão com dados simulados (mockados) ou sem a conexão com o banco ainda:
 <img width="35" height="46" alt="image" src="https://github.com/user-attachments/assets/eba01b75-c369-4f23-b472-e486cd7b388e" />

<br>
<br>

| Página | Estado | Situação |
|-|-|-|
| `index.html` | 🟢 Funcional | Login integrado ao Supabase e redirecionamento por perfil implementados. O HTML do formulário ainda possui inconsistências estruturais e exibe credenciais de teste. |
| `public/ajuda.html` | 🟢 Funcional | Contatos e função para copiar o endereço de e-mail implementados. |
| `public/sobre.html` | 🟢 Funcional | Conteúdo funcional |
| `public/mapa-site.html` | 🟢 Funcional | Mapa estático e responsivo das áreas do sistema. |
| `protected/rh_sme/users.html` | 🟢 Funcional | Criação de usuários, criação de perfis, listagem e feedback visual implementados. |
| `protected/escola/contrata.html` | 🟢 Funcional | Busca cargos no Supabase e registra solicitações. A tabela ainda carrega as solicitações cadastradas. No entanto os botões de visualização ainda não funcionam e ainda não tem opção de editar |
| `protected/rh_sme/cargos.html` | 🟢 Funcional | Cargos da tabela `positions`. |
| `public/ferias.html` | 🟡 Mockada | Formulário visual ainda sem controller ou integração com as tabelas `requests` e `vacation_requests`. |
| `protected/escola/desdobramento.html` | 🟡 Mockada | Modal coleta os dados, mas apenas os registra no console. A tabela possui registros fixos. |
| `protected/pedagogico/painel.html` | 🟡 Mockada | Solicitações e ações são estáticas, sem integração com o Supabase. |
| `protected/rh_sme/contrata.html` | 🟡 Mockada | Linhas e status fixos. Os botões não executam operações. |
| `protected/rh_sme/desdobramento.html` | 🟡 Mockada | Dados fixos e botões sem integração com o banco. |
| `protected/rh_sme/ferias.html` | 🟡 Mockada | Dados fixos. Os botões de criação de documentos não possuem comportamento. |
| `protected/rh_adm/painel.html` | 🟡 Mockada | Dados, status e ações são apenas demonstrativos. |

### Resumo

- 🟢 **Funcionais:** 7 páginas
- 🟡 **Mockadas:** 7 páginas

> As navbars, identificação do usuário, logout e footer são componentes compartilhados funcionais.


## Próximos passos

* Definir funcionalidade das páginas mockadas
* Testar os fluxos
* Implementar funcionalidades nos botões que ainda não tem funcionalidade
* **Ajustar o modal de solicitação para cargos de 20h e 30h**
* Implementar um controle de acessos (no momento qualquer usuário acessa tudo, mesmo na página protected através de endereços das páginas)
