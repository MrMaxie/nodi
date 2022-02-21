# utils
type.is       -> x => bool
type.assert   -> x => throw?
type.create   -> x => x / throw
type.validate -> x => Error?

caster.cast   -> a => b / throw

# types
any
array
bigint
bool / boolean
date
enums
func / fn
instance
integer / int
intersection
literal
map
never
number
nullable
object
optional
record
regexp
set
string
tuple
type
union
unknown
+ custom

# validators
empty
max
min
nonEmpty
pattern
size
deprecated
dynamic
lazy
partial
omit
pick
+ custom

# casters
alt / default
trim
+ custom


