# Vitrino — site + templates

Site de apresentação da Vitrino e os 3 modelos de demonstração (um por plano). É tudo HTML estático, sem build, pronto pro GitHub Pages.

```
index.html                  ← site da Vitrino (planos + modelos)
assets/                     ← logo.svg, logo-branco.svg, icone.svg, favicon.svg
templates/basico/index.html ← Plano Básico  (Brasa & Pão — hamburgueria)
templates/loja/index.html   ← Plano Loja    (Flor de Lis — moda)
templates/premium/index.html← Plano Premium (Patas & Cia — pet shop)
```

## Publicar no GitHub Pages

```bash
git init && git add . && git commit -m "Vitrino: site e templates"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/vitrino.git
git push -u origin main
```

No GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
Em 1–2 minutos o site fica em `https://SEU_USUARIO.github.io/vitrino/`.

Domínio próprio (ex.: `vitrino.com.br`): crie um arquivo `CNAME` com o domínio e aponte o DNS no Registro.br pros IPs do GitHub Pages (veja a doc oficial do GitHub Pages sobre domínio personalizado).

## Antes de publicar

- Os modelos usam o WhatsApp `5521994542037` (troque pelo do cliente ao copiar um modelo) no `<script>` do final de cada arquivo (formato: 55 + DDD + número).
- Confira se o nome "Vitrino" está livre no INPI e se o domínio está disponível no Registro.br.

## Criar o site de um cliente novo

1. Copie a pasta do template do plano contratado para um repositório novo do cliente.
2. Apague a faixa laranja "Template de demonstração" (o `<div class="demo">`).
3. Edite os blocos marcados com `CONFIGURE AQUI`: cores (`:root`), número do WhatsApp, chave Pix e a lista `PRODUTOS`.
4. Troque textos, endereço, horários e CNPJ.
5. Publique no GitHub Pages ou na Vercel e ligue o domínio do cliente.

Prompt para o Claude Code:

> Copie templates/loja para ../cliente-NOME. Remova a faixa de demonstração. Use as cores #XXXXXX e #YYYYYY, WhatsApp 55DDNNNNNNNNN, chave Pix X. Substitua PRODUTOS pelos itens desta planilha: [cole aqui]. Troque os textos para uma loja de [ramo] em [cidade]. Depois rode um teste no celular (390px) e me mostre um print.
