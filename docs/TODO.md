
[ ] Izvuci API url u .env varijablu
promijenit lozinku baze

 
  UserPermissions da bude uniq prema Akedemskoj godini i UsersPositions
    u model  class Meta:
        unique_together = ['competition', 'category_group', 'stage']


