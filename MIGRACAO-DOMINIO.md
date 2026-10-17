# Domínio do IL Bate Papo

Destino: bate.papo.il-talk.com.br.

Preparação apenas: não mesclar até ajustar login e destinos de push. O CNAME ativa redirecionamento do endereço github.io e pode afetar os caminhos de outros projetos da mesma conta; conferir especialmente /IL-Talk-Mioko/ antes de aplicar.

1. Supabase ngidsolvxegpyrprlbex: permitir o retorno de autenticação no domínio novo, preservando os anteriores; confirmar isolamento do login e sessão. Conector atual retorna sem permissão.
2. Push: incluir exclusivamente a origem nova do IL Bate Papo na função que valida Origin; manter as demais origens existentes. Ajustar links de chamadas e mensagens e reinscrever os dispositivos na origem nova. Não reutilizar a inscrição do github.io como prova de entrega na origem nova.
3. GitHub Pages deste repositório: cadastrar Custom domain bate.papo.il-talk.com.br. Arquivo CNAME preparado nesta branch; ainda não ativado em main.
4. Registro.br: CNAME nome bate.papo, destino ilbate-papo.github.io (sem https e sem caminho). Preservar os demais registros.
5. Conferir DNS e emissão do certificado antes de exigir HTTPS; validar login, mensagens e chamadas em Android e computador. Não declarar entrega em segundo plano sem teste real.
